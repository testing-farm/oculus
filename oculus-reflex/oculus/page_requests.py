import reflex as rx
from .components.page import create_page_layout
from .components.state import State
from .components.patternfly import (spinner, accordion, accordion_item, accordion_toggle, accordion_content, code_block,
                                    code_block_code, button, label, tabs, tab)
from datetime import datetime, timedelta
import requests
from typing import Optional
import pydantic

REQUEST_STATES = ['New', 'Queued', 'Running', 'Error', 'Complete']


class RequestRun(rx.Base):
    artifacts: str

class Request(rx.Base):
    user_id: str
    id: str
    request_state: str = pydantic.Field(alias='state')  # state needs an alias, possibly a reserved keyword?
    run: Optional[RequestRun]
    created: str
    updated: str

class RequestsState(State):
    requests_loading = False
    requests: list[Request] = []
    my_requests: list[Request] = []
    my_requests_loading = False

    query_state: str = REQUEST_STATES[0]

    page_requests_active_tab = 1

    def _get_requests(self, url) -> list[Request]:
        response = requests.get(url)
        print('fetching requests from tf api', url)
        loaded_requests = []
        if response.status_code == 200:
            loaded_requests = sorted(
                [Request(**request) for request in response.json()],
                key=lambda request: request.created,
                reverse=True
            )
        print('done fetching requests from tf api', len(loaded_requests))
        return loaded_requests

    def load_queried_requests(self):
        created_after = datetime.now() - timedelta(days=3)
        url = 'https://api.dev.testing-farm.io/v0.1/requests?state={}&created_after={}'.format(
            self.query_state.lower(),
            created_after.strftime('%Y-%m-%d')
        )
        self.requests = self._get_requests(url)
        self.requests_loading = False
    
    def load_my_requests(self):
        if not self._logged_user_id:
            return
        self.my_requests = self._get_requests(f'https://api.dev.testing-farm.io/v0.1/requests?user_id={self._logged_user_id}')
        self.my_requests_loading = False

    toggled_accordion: Optional[str] = None
    def toggle_accordion(self, id: str):
        if id == self.toggled_accordion:
            self.toggled_accordion = None
        else:
            self.toggled_accordion = id

    def enable_spinner(self):
        self.requests_loading = True

    def enable_spinner_my_requests(self):
        self.my_requests_loading = True

def get_label(state: str) -> rx.Component:
    return rx.cond(
        state == 'new',
        label(state, color='green'),
        rx.cond(
            state == 'queued',
            label(state, color='cyan'),
            rx.cond(
                state == 'running',
                label(state, color='blue'),
                rx.cond(
                    state == 'error',
                    label(state, color='red'),
                    rx.cond(
                        state == 'complete',
                        label(state, color='purple'),
                        label(state, color='black'),
                    )
                )
            )
        )
    )

def show_request(request: Request) -> rx.Component:
    request_id = request.id.to_string()[1:-1]
    api_url = "https://api.dev.testing-farm.io/v0.1/requests/" + request_id
    #artifacts_url = request.run.artifacts.to_string()[1:-1] if request.run else ''
    request_string = request.to_string()
    return accordion_item(
        accordion_toggle(
            rx.fragment(
                request.created.to_string()[1:-11],
                get_label(request.request_state),
                request.id
            ),
            isExpanded=(RequestsState.toggled_accordion == request.id),
            on_click=RequestsState.toggle_accordion(request.id)
        ),
        accordion_content(
            rx.fragment(
                rx.link(
                    button("API", variant="link"),
                    href=api_url,
                    is_external=True,
                ),
                rx.cond(
                    request.run,
                    rx.link(
                        button("Artifacts", variant="link"),
                        href=request.run.artifacts.to_string()[1:-1],
                        is_external=True,
                    )
                ),
                rx.link(
                    button("Restart", variant="primary"),
                    href='submit/' + request_id,
                ),
                code_block(
                    code_block_code(
                        request_string
                        #str({k: v for k, v in request.items()})
                    ),
                    width="90%"
                ),
            ),
            isHidden=(RequestsState.toggled_accordion != request.id),
        )
    )
    #return rx.text(request['id'])#rx.box([f'{k}: {v}' for k, v in request.items()])

def requests_component(show_spinner: bool, requests: list[Request]) -> rx.Component:
    return rx.cond(
        show_spinner,
        spinner(),
        rx.cond(
            requests,
            rx.box(
                accordion(
                    rx.foreach(requests, show_request),
                    isBordered=True,
                ),
                width="90%",
            ),
            rx.text("No requests found.")
        )
    )

def tab_query() -> rx.Component:
    return rx.fragment(
        rx.select(
            REQUEST_STATES,
            on_change=RequestsState.set_query_state,
        ),
        button("Search requests", variant="primary", on_click=[
            RequestsState.enable_spinner,
            RequestsState.load_queried_requests
        ]),
        requests_component(RequestsState.requests_loading, RequestsState.requests)
    )

def tab_my_requests() -> rx.Component:
    return rx.fragment(
        rx.cond(
            State.logged_in,
            rx.fragment(
                button("Reload", variant="primary", on_click=[
                    RequestsState.enable_spinner_my_requests,
                    RequestsState.load_my_requests,
                ]),
                requests_component(RequestsState.my_requests_loading, RequestsState.my_requests),
            ),
            rx.text('Log in to view your requests')
        )
    )

def page_requests() -> rx.Component:
    return create_page_layout(rx.fragment(
        tabs(
            tab(
                tab_query(),
                title='Query Requests', eventKey=1, on_click=RequestsState.set_page_requests_active_tab(1)
            ),
            tab(
                tab_my_requests(),
                title='My Requests', eventKey=2, on_click=RequestsState.set_page_requests_active_tab(2)
            ),
            activeKey=RequestsState.page_requests_active_tab
        ),
    ))
