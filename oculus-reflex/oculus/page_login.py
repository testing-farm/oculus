import reflex as rx

from .components.state import State
from .components.page import create_page_layout
from .components.patternfly import button

def page_login() -> rx.Component:
    return create_page_layout(
        rx.fragment(
            rx.input(on_change=State.set_login_form_token),
            button('Log in', on_click=State.login_click)
            ),
        )
