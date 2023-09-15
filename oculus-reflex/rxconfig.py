import reflex as rx

class Oculus(rx.Config):
    pass

config = Oculus(
    app_name="oculus",
    frontend_packages=["next-transpile-modules"],
)