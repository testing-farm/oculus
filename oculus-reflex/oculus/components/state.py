import reflex as rx
from typing import Optional
import requests

class State(rx.State):
    counter = 0
    active_tab = 1

    logged_in: bool = False
    _logged_user_name: str = ''
    _logged_user_id: str = ''
    _logged_user_key: str = ''

    @rx.var
    def logged_user_name(self) -> str:
        return self._logged_user_name

    @rx.var
    def logged_user_id(self) -> str:
        return self._logged_user_id

    @rx.var
    def logged_user_key(self) -> str:
        return self._logged_user_key

    def inc(self):
        self.counter += 1


    @rx.var
    def current_page(self):
        return self.get_current_page()
    login_form_token: str

    def login_click(self):
        print('Logging in')
        url = 'https://internal.api.dev.testing-farm.io/v0.1/users?api_key={}'.format(self.login_form_token)
        
        result = requests.get(url).json()
        for user in result:
            if user['api_key'] == self.login_form_token:
                self._logged_user_name = user['name']
                self._logged_user_id = user['id']
                self._logged_user_key = user['api_key']
                self.logged_in = True
                break

        print('Logged in as:')
        print(self.login_form_token)
        print(self.logged_user_name)
        print(self.logged_user_id)
        print(self.logged_user_key)

    main_toggled_accordion: Optional[str] = None
    def toggle_accordion(self, id: str):
        if id == self.main_toggled_accordion:
            self.main_toggled_accordion = None
        else:
            self.main_toggled_accordion = id
