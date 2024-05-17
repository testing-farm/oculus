from rxconfig import config

import reflex as rx

from .page_requests import page_requests
from .page_login import page_login
from .page_submit_request import page_submit_request
from .page_hidden import page_hidden
from .page_index import index

docs_url = "https://reflex.dev/docs/getting-started/introduction"
filename = f"{config.app_name}/{config.app_name}.py"

app = rx.App()
app.add_page(index)
app.add_page(page_hidden, 'hidden')
app.add_page(page_requests, 'requests')
app.add_page(page_submit_request, 'submit/[request]')
app.add_page(page_login, 'login')
