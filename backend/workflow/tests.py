from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import WorkflowItem

User = get_user_model()


class WorkflowItemTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("alice", password="StrongPass123!")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")

    def test_requires_authentication(self):
        self.client.credentials()
        self.assertEqual(self.client.get("/api/items/").status_code, 401)

    def test_create_and_list(self):
        res = self.client.post(
            "/api/items/", {"title": "Write report", "description": "Task 1"}, format="json"
        )
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["status"], "pending")
        listing = self.client.get("/api/items/")
        self.assertEqual(len(listing.data), 1)

    def test_update_status(self):
        item = WorkflowItem.objects.create(owner=self.user, title="Build CI")
        res = self.client.patch(
            f"/api/items/{item.id}/", {"status": "in_progress"}, format="json"
        )
        self.assertEqual(res.status_code, 200)
        item.refresh_from_db()
        self.assertEqual(item.status, "in_progress")

    def test_edit_and_delete(self):
        item = WorkflowItem.objects.create(owner=self.user, title="Old title")
        edit = self.client.put(
            f"/api/items/{item.id}/",
            {"title": "New title", "description": "", "status": "completed"},
            format="json",
        )
        self.assertEqual(edit.status_code, 200)
        self.assertEqual(edit.data["title"], "New title")
        self.assertEqual(self.client.delete(f"/api/items/{item.id}/").status_code, 204)
        self.assertFalse(WorkflowItem.objects.filter(id=item.id).exists())

    def test_users_cannot_see_each_others_items(self):
        other = User.objects.create_user("bob", password="StrongPass123!")
        theirs = WorkflowItem.objects.create(owner=other, title="Private")
        self.assertEqual(len(self.client.get("/api/items/").data), 0)
        self.assertEqual(self.client.get(f"/api/items/{theirs.id}/").status_code, 404)
