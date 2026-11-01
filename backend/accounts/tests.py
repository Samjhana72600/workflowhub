from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

PASSWORD = "StrongPass123!"


class AuthTests(APITestCase):
    def test_register_returns_token(self):
        res = self.client.post(
            "/api/auth/register/",
            {"username": "alice", "email": "a@example.com", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        self.assertIn("token", res.data)
        self.assertTrue(get_user_model().objects.filter(username="alice").exists())

    def test_register_rejects_weak_password(self):
        res = self.client.post(
            "/api/auth/register/",
            {"username": "bob", "password": "12345678"},
            format="json",
        )
        self.assertEqual(res.status_code, 400)

    def test_login_success_and_failure(self):
        get_user_model().objects.create_user("carol", password=PASSWORD)
        ok = self.client.post(
            "/api/auth/login/", {"username": "carol", "password": PASSWORD}, format="json"
        )
        self.assertEqual(ok.status_code, 200)
        self.assertIn("token", ok.data)
        bad = self.client.post(
            "/api/auth/login/", {"username": "carol", "password": "wrong"}, format="json"
        )
        self.assertEqual(bad.status_code, 400)

    def test_logout_invalidates_token(self):
        get_user_model().objects.create_user("dave", password=PASSWORD)
        token = self.client.post(
            "/api/auth/login/", {"username": "dave", "password": PASSWORD}, format="json"
        ).data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        self.assertEqual(self.client.post("/api/auth/logout/").status_code, 204)
        # Old token no longer works
        self.assertEqual(self.client.get("/api/items/").status_code, 401)
