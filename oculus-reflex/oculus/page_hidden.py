import reflex as rx
from .components.patternfly import (spinner, nav, nav_list, nav_item, tab, tabs, tab_title_text, button, accordion,
                                    accordion_toggle, accordion_item, accordion_content, code_block, code_block_code,
                                    brand, external_link_square_alt_icon, label, form_select, form_select_option,
                                    card_patternfly, card_title_patternfly, card_body_patternfly, card_footer_patternfly,
                                    alert_patternfly)
from .components.page import create_page_layout

from .components.state import State

class HiddenState(State):
    form_value: str = 'value1'
    active_spinner = True
    active_tab = 1
    active_top_tab = 1

    def swap_spinner(self):
        self.active_spinner = not self.active_spinner
    def form_value_change(self, value):
        self.form_value = value


def page_hidden() -> rx.Component:
    return create_page_layout(rx.vstack(
        tabs(
            tab(
                "foo",
                eventKey=0,
                title="tab0",
            ),   
            tab(
                rx.vstack(
                    rx.text('tab1 content'),
                    alert_patternfly(variant="info", title="Info alert title", ouiaId="InfoAlert")
                ),
                eventKey=1,
                title="tab1",
            ),
            activeKey=HiddenState.active_top_tab,
            onSelect=lambda _, value: HiddenState.set_active_top_tab(value),
        ),
        rx.cond(HiddenState.active_spinner, spinner()),
        button("primary", variant="primary", on_click=HiddenState.swap_spinner),
        button("primary", variant="primary", on_click=State.inc, isDisabled=True),
        button("secondary", variant="secondary", on_click=State.inc),
        button("secondary", variant="secondary", on_click=State.inc, isDisabled=True),
        button("tertiary", variant="tertiary", on_click=State.inc),
        button("tertiary", variant="tertiary", on_click=State.inc, isDisabled=True),
        button("danger", variant="danger", on_click=HiddenState.set_active_top_tab(0)),
        button("warning", variant="warning", on_click=HiddenState.set_active_top_tab(1)),
        rx.link(button("Link", variant="link"), href="https://example.com"),
        button("Link", variant="link", isDisabled=True),
        card_patternfly(
            card_title_patternfly(f"Card title, clicks: {State.counter}"),
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
                title='tab1 title', eventKey=1,
            ),
            tab(
                rx.vstack(
                    rx.text('tab2 content'),
                    alert_patternfly(variant="success", title="Success alert title", ouiaId="SuccessAlert")
                ),
                title='tab2 title', eventKey=2,
            ),
            tab(
                rx.vstack(
                    rx.text('tab3 content'),
                    alert_patternfly(variant="warning", title="Warning alert title", ouiaId="WarningAlert")
                ),
                title='tab3 title', eventKey=3,
            ),
            tab(
                rx.vstack(
                    rx.text('tab4 content'),
                    alert_patternfly(variant="danger", title="Danger alert title", ouiaId="DangerAlert")
                ),
                title='tab4 title', eventKey=4,
            ),
            activeKey=HiddenState.active_tab,
            onSelect=lambda _, value: HiddenState.set_active_tab(value),
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
            #on_change=lambda e0: HiddenState.form_value_change(e0),
        ),
    ))
