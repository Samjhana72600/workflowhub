from rest_framework import viewsets

from .models import WorkflowItem
from .serializers import WorkflowItemSerializer


class WorkflowItemViewSet(viewsets.ModelViewSet):
    """Full CRUD for the logged-in user's own workflow items."""

    serializer_class = WorkflowItemSerializer

    def get_queryset(self):
        return WorkflowItem.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
