import reflex as rx

from .components.patternfly import code_editor, code_block, code_block_code, button
from .components.page import create_page_layout
from .components.state import State

import subprocess

import re
import requests
from typing import Any

class Request(rx.Base):
    environments: list[dict[str, Any]]
    test: dict[str, Any]
    api_key: str

class SubmitRequestState(State):
    submit_response_id: str = ''

    request: dict[str, Any]

    @rx.var
    def get_json_to_restart(self):
        request_id = self.get_query_params().get("request", "no request")

        # UUID pattern
        uuid_pattern = re.compile('[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}')

        # Find the UUID in the string
        uuid_match = uuid_pattern.search(request_id)

        if not uuid_match:
            return

        # Extract the UUID from the match object
        _request_id = uuid_match.group()

        # Construct URL to the internal API
        get_url = "https://api.dev.testing-farm.io/v0.1/requests/{}".format(_request_id)

        # Setting up retries
        session = requests.Session()
        #install_http_retries(session)

        # Get the request details
        response = session.get(get_url)

        #if response.status_code == 404:
        #    exit_error(f"API token is invalid. See {settings.ONBOARDING_DOCS} for more information.")

        if response.status_code != 200:
            print(f"Unexpected error.")

        request = response.json()
        #request = self.request

        # Transform to a request
        request['environments'] = request['environments_requested']

        # Remove all keys except test and environments
        for key in list(request):
            if key not in ['test', 'environments']:
                del request[key]

        # Remove all empty keys in test
        for key in list(request['test']):
            for subkey in list(request['test'][key] or []):
                if not request['test'][key][subkey]:
                    del request['test'][key][subkey]
            if not request['test'][key]:
                del request['test'][key]

        #test_type = "fmf" if "fmf" in request["test"] else "sti"

        # Add API key
        self.r = Request(
            environments=request["environments"],
            test=request["test"],
            api_key=self._logged_user_key
        )
        return self.r.json()

    def submit(self):
        import json
        session = requests.Session()
        post_url = "https://api.dev.testing-farm.io/v0.1/requests"
        print(json.loads(self.r.json()))
        response = session.post(post_url, json=json.loads(self.r.json()))
        print(response)
        print(response.json())
        response_json = response.json()
        if "id" in response_json:
            self.submit_response_id = response_json["id"]
        else:
            self.submit_response_id = str(response_json)



def page_submit_request() -> rx.Component:
    return create_page_layout(rx.fragment(
        code_block(code_block_code(SubmitRequestState.get_json_to_restart)),
        button("Submit", variant="primary", on_click=SubmitRequestState.submit),
        rx.text(SubmitRequestState.submit_response_id)
    ))
