from locust import HttpUser, task


class WebTest(HttpUser):
    @task
    def on_start(self):
        self.client.get("/hola")
