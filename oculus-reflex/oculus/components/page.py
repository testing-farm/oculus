import reflex as rx
from .navigation import navigation
from .state import State
from .patternfly import masthead, masthead_main, masthead_content, masthead_brand, brand

def create_page_layout(content: rx.Component) -> rx.Component:
    return rx.fragment(
        masthead(
            masthead_main(
            ),
            masthead_content(
                rx.hstack(
                    rx.cond(
                        State.logged_user_id,
                        rx.fragment(
                            rx.text('Logged in as'), rx.text(State.logged_user_name),
                            rx.text('with API key'), rx.text(State.logged_user_key),
                        ),
                        rx.text('Not logged in'),
                    ),
                ),
            )
        ),
        rx.hstack(
            navigation(),
            rx.box(
                content,
                width="100%"
            ),
            align_items="top",
        )
    )
