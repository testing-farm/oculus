from rxconfig import config

import reflex as rx

from .components.patternfly import (spinner, nav, nav_list, nav_item, tab, tabs, tab_title_text, button, accordion,
                                    accordion_toggle, accordion_item, accordion_content, code_block, code_block_code,
                                    brand, external_link_square_alt_icon, label, form_select, form_select_option)
from .components.page import create_page_layout
from .components.state import State

from .page_requests import page_requests
from .page_login import page_login
from .page_submit_request import page_submit_request


### Wrapping Patternfly
class HomeState(State):
    form_value: str = 'value1'
    active_spinner = True
    def swap_spinner(self):
        self.active_spinner = not self.active_spinner
    def form_value_change(self, value):
        self.form_value = value

class CardPatternfly(rx.Component):
    library = "@patternfly/react-core"
    tag = "Card"
    ouiaId: rx.Var[str] = "BasicCard"

class CardTitlePatternfly(rx.Component):
    library = "@patternfly/react-core"
    tag = "CardTitle"

class CardBodyPatternfly(rx.Component):
    library = "@patternfly/react-core"
    tag = "CardBody"

class CardFooterPatternfly(rx.Component):
    library = "@patternfly/react-core"
    tag = "CardFooter"


class AlertPatternfly(rx.Component):
    library = "@patternfly/react-core"
    tag = "Alert"
    variant: rx.Var[str]
    title: rx.Var[str]
    ouiaId: rx.Var[str]

card_patternfly = CardPatternfly.create
card_title_patternfly = CardTitlePatternfly.create
card_body_patternfly = CardBodyPatternfly.create
card_footer_patternfly = CardFooterPatternfly.create
alert_patternfly = AlertPatternfly.create
###

docs_url = "https://reflex.dev/docs/getting-started/introduction"
filename = f"{config.app_name}/{config.app_name}.py"


def tf_requests() -> rx.Component:
    print('creating list of requests', State.requests)
    return rx.fragment(
        *[rx.text(str(request)) for request in State.requests if State.requests]
    )


def index() -> rx.Component:
    return create_page_layout(rx.vstack(
        rx.cond(HomeState.active_spinner, spinner()),
        button("primary", variant="primary", on_click=HomeState.swap_spinner),
        button("primary", variant="primary", on_click=State.inc, isDisabled=True),
        button("secondary", variant="secondary", on_click=State.inc),
        button("secondary", variant="secondary", on_click=State.inc, isDisabled=True),
        button("tertiary", variant="tertiary", on_click=State.inc),
        button("tertiary", variant="tertiary", on_click=State.inc, isDisabled=True),
        button("danger", variant="danger", on_click=State.inc),
        button("warning", variant="warning", on_click=State.inc),
        rx.link(button("Link", variant="link"), href="https://example.com"),
        button("Link", variant="link", isDisabled=True),
        card_patternfly(
            card_title_patternfly("Card title, clicks: " + State.counter),
            card_body_patternfly("Card body"),
            card_footer_patternfly("Card body")
        ),
        label("blue label", color="blue"),
        label("red label", color="red"),
        label("green label", color="green"),
        label("purple label", color="purple"),
        label("cyan label", color="cyan"),
        label("gold label", color="gold"),
        alert_patternfly(variant="info", title="Info alert title", ouiaId="InfoAlert"),
        alert_patternfly(variant="success", title="Success alert title", ouiaId="SuccessAlert"),
        alert_patternfly(variant="warning", title="Warning alert title", ouiaId="WarningAlert"),
        alert_patternfly(variant="danger", title="Danger alert title", ouiaId="DangerAlert"),
        #tf_requests(),
        nav(
            nav_list(
                nav_item('Link 1', isActive=False),
                nav_item('Link 2', isActive=False),
                nav_item('Link 3', isActive=True),
            ),
            theme="light"
        ),
        nav(
            nav_list(
                nav_item('Link 1', isActive=False),
                nav_item('Link 2', isActive=False),
                nav_item('Link 3', isActive=True),
            ),
        ),
        tabs(
            tab(
                rx.vstack(
                    rx.text('tab1 content'),
                    alert_patternfly(variant="info", title="Info alert title", ouiaId="InfoAlert")
                ),
                title='tab1 title', eventKey=1, on_click=State.set_active_tab(1)
            ),
            tab(
                rx.vstack(
                    rx.text('tab2 content'),
                    alert_patternfly(variant="success", title="Success alert title", ouiaId="SuccessAlert")
                ),
                title='tab2 title', eventKey=2, on_click=State.set_active_tab(2)
            ),
            tab(
                rx.vstack(
                    rx.text('tab3 content'),
                    alert_patternfly(variant="warning", title="Warning alert title", ouiaId="WarningAlert")
                ),
                title='tab3 title', eventKey=3, on_click=State.set_active_tab(3)
            ),
            tab(
                rx.vstack(
                    rx.text('tab4 content'),
                    alert_patternfly(variant="danger", title="Danger alert title", ouiaId="DangerAlert")
                ),
                title='tab4 title', eventKey=4, on_click=State.set_active_tab(4)
            ),
            activeKey=State.active_tab
        ),
        
        rx.box(
            accordion(
                accordion_item(
                    accordion_toggle(
                            "Item one",

                        #id="1",
                        isExpanded=(State.main_toggled_accordion == "1"),
                        on_click=State.toggle_accordion("1")
                    ),
                    accordion_content(
                        rx.fragment(
                            "Content one",
                            code_block(
                                code_block_code(
                                    "asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd\nasd\nasd\nas\nda\nsd\nads\nda\ns\n"
                                )
                            )
                        ),
                        isHidden=(State.main_toggled_accordion != "1"),
                    )
                ),
                accordion_item(
                    accordion_toggle(
                        "Item two",
                        #id="2",
                        isExpanded=(State.main_toggled_accordion == "2"),
                        on_click=State.toggle_accordion("2"),
                    ),
                    accordion_content(
                        rx.fragment(
                            "Content two",
                            code_block(
                                code_block_code(
                                    {"hello": "world", "key1": 1, "key2": True}
                                )
                            )
                        ),
                        isHidden=(State.main_toggled_accordion != "2"),
                    ),
                ),
                isBordered=True,
            ),
            width="90%",
        ),
        form_select(
            form_select_option(value='value1', label='label1'),
            form_select_option(value='value2', label='label2'),
            key='hello',
            on_change=HomeState.form_value_change,
            value=HomeState.form_value
        ),
    ))



# Add state and page to the app.
app = rx.App(state=State)
app.add_page(index)
app.add_page(page_requests, 'requests')
app.add_page(page_submit_request, 'submit/[request]')
app.add_page(page_login, 'login')
app.compile()
