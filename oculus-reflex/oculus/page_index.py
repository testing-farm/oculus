import reflex as rx

from .components.page import create_page_layout
from .components.patternfly import title

def index() -> rx.Component:
    return create_page_layout(title('Welcome to Testing Farm!', headingLevel='h1'))

