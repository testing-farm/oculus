import reflex as rx
from .patternfly import nav, nav_list, nav_item
from .state import State

import enum

class Pages(enum.Enum):
    home = enum.auto()
    requests = enum.auto()
    submit_request = enum.auto()
    login = enum.auto()

class NavigationState(State):
    def redirect(self, destination: str):
        print('redirect ', destination)
        self.current_page = destination
        rx.redirect(destination)

def create_nav_item(title: str, destination: str) -> rx.Component:
    return rx.link(
        nav_item(
            title,
            to=destination,
            isActive=State.current_page == destination,
            component='span',
        ),
        href=destination,
        style=rx.style.Style({
            'text-decoration': 'none'
        })
    )

def navigation() -> rx.Component:
    return rx.fragment(
        rx.vstack(
            nav(
                nav_list(
                    create_nav_item('Home', '/'),
                    create_nav_item('List requests', '/requests'),
                    create_nav_item('Login', '/login'),
                ),
                theme="light"
            ),
        )
    )
