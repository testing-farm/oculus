import reflex as rx

from typing import Any, Union


class PatternflyComponent(rx.Component):
    library = "@patternfly/react-core"

class ExternalLinkSquareAltIcon(PatternflyComponent):
    tag = "ExternalLinkSquareAltIcon"

class Button(PatternflyComponent):
    tag = "Button"

    variant: rx.Var[str] = "primary"
    #ouiaId: rx.Var[str] = "Primary"
    #icon: rx.Var[ExternalLinkSquareAltIcon]
    iconPosition: rx.Var[str]
    isDisabled: rx.Var[bool]

class Spinner(PatternflyComponent):
    tag = "Spinner"

class Nav(PatternflyComponent):
    tag = "Nav"

    ouiaId: rx.Var[str]
    theme: rx.Var[str]

class NavList(PatternflyComponent):
    tag = "NavList"

class NavItem(PatternflyComponent):
    tag = "NavItem"
    isActive: rx.Var[bool]
    to: rx.Var[str]
    component: rx.Var[str]

class Tabs(PatternflyComponent):
    tag = "Tabs"
    activeKey: rx.Var[Union[str, int]]

    def get_event_triggers(self) -> dict[str, Any]:
        return {
            **super().get_event_triggers(),
            "onSelect": lambda e0, e1: [e0, e1],
        }

class Tab(PatternflyComponent):
    tag = "Tab"
    title: rx.Var[str]
    eventKey: rx.Var[Union[str, int]]

class TabTitleText(PatternflyComponent):
    tag = "Tab"

class LoginForm(PatternflyComponent):
    tag = "LoginForm"
    usernameValue: rx.Var[str]

    @classmethod
    def get_controlled_triggers(cls) -> dict[str, rx.Var]:
        return {
            "on_login_button_click": rx.EVENT_ARG,
            "handle_password_change": rx.EVENT_ARG
        }

class FormSelect(PatternflyComponent):
    tag = "FormSelect"
    value: rx.Var[str]

    def get_event_triggers(self) -> dict[str, Any]:
        return {
            **super().get_event_triggers(),
            "on_change": lambda e0: [e0],
        }

class FormSelectOption(PatternflyComponent):
    tag = "FormSelectOption"
    #isDisabled: rx.Var[bool]
    #key: rx.Var[str]
    value: rx.Var[str]
    label: rx.Var[str]


class LoginPage(PatternflyComponent):
    tag = "LoginPage"
    loginTitle: rx.Var[str]="Log in to your account"
    loginSubtitle: rx.Var[str]="Enter your single sign-on LDAP credentials."

class Form(PatternflyComponent):
    tag = "Form"
    isHorizontal: rx.Var[bool] = True

class FormGroup(PatternflyComponent):
    tag = "FormGroup"
    isRequired: rx.Var[bool] = False
    label: rx.Var[str]

class TextInput(PatternflyComponent):
    tag = "TextInput"
    isRequired: rx.Var[bool] = False
    #value: rx.Var[str]
    type: rx.Var[str]

    @classmethod
    def get_controlled_triggers(cls) -> dict[str, rx.Var]:
        return {
            "on_change": rx.EVENT_ARG,
            "on_blur": rx.EVENT_ARG,
            "on_focus": rx.EVENT_ARG,
        }

class ActionGroup(PatternflyComponent):
    tag = "ActionGroup"

class Masthead(PatternflyComponent):
    tag = "Masthead"

class MastheadToggle(PatternflyComponent):
    tag = "MastheadToggle"

class MastheadMain(PatternflyComponent):
    tag = "MastheadMain"

class MastheadContent(PatternflyComponent):
    tag = "MastheadContent"

class MastheadBrand(PatternflyComponent):
    tag = "MastheadBrand"

class Brand(PatternflyComponent):
    tag = "Brand"
    alt = rx.Var[str]
    src = rx.Var[str]

class Accordion(PatternflyComponent):
    tag = "Accordion"
    isBordered: rx.Var[bool]

class AccordionItem(PatternflyComponent):
    tag = "AccordionItem"

class AccordionToggle(PatternflyComponent):
    tag = "AccordionToggle"
    isExpanded: rx.Var[bool]

class AccordionContent(PatternflyComponent):
    tag = "AccordionContent"
    isHidden: rx.Var[bool]

class CodeBlock(PatternflyComponent):
    tag = "CodeBlock"

class CodeBlockCode(PatternflyComponent):
    tag = "CodeBlockCode"

class Popover(PatternflyComponent):
    tag = "Popover"
    isVisible: rx.Var[bool]
    position: rx.Var[str]
    hideOnOutsideClick: rx.Var[bool]
    bodyContent: rx.Var[str]

class CodeEditor(rx.Component):
    library = "@patternfly/react-code-editor"
    tag = "CodeEditor"
    code: rx.Var[str]

class Label(PatternflyComponent):
    tag = "Label"
    color: rx.Var[str]

class CardPatternfly(PatternflyComponent):
    tag = "Card"
    ouiaId: rx.Var[str] = "BasicCard"

class CardTitlePatternfly(PatternflyComponent):
    tag = "CardTitle"

class CardBodyPatternfly(PatternflyComponent):
    tag = "CardBody"

class CardFooterPatternfly(PatternflyComponent):
    tag = "CardFooter"


class AlertPatternfly(PatternflyComponent):
    tag = "Alert"
    variant: rx.Var[str]
    title: rx.Var[str]
    ouiaId: rx.Var[str]

class Title(PatternflyComponent):
    tag = "Title"
    headingLevel: rx.Var[str]


card_patternfly = CardPatternfly.create
card_title_patternfly = CardTitlePatternfly.create
card_body_patternfly = CardBodyPatternfly.create
card_footer_patternfly = CardFooterPatternfly.create
alert_patternfly = AlertPatternfly.create

button = Button.create
external_link_square_alt_icon = ExternalLinkSquareAltIcon.create
spinner = Spinner.create
nav = Nav.create
nav_list = NavList.create
nav_item = NavItem.create
tabs = Tabs.create
tab = Tab.create
tab_title_text = TabTitleText.create
login_form = LoginForm.create
login_page = LoginPage.create
form = Form.create
form_group = FormGroup.create
text_input = TextInput.create
action_group = ActionGroup.create
masthead = Masthead.create
masthead_content = MastheadContent.create
masthead_main = MastheadMain.create
masthead_toggle = MastheadToggle.create
masthead_brand = MastheadBrand.create
brand = Brand.create
accordion = Accordion.create
accordion_item = AccordionItem.create
accordion_toggle = AccordionToggle.create
accordion_content = AccordionContent.create
code_block = CodeBlock.create
code_block_code = CodeBlockCode.create
popover = Popover.create
code_editor = CodeEditor.create
label = Label.create
form_select = FormSelect.create
form_select_option = FormSelectOption.create
title = Title.create
