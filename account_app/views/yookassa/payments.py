from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer
from yookassa import Configuration, Client
from django.shortcuts import get_object_or_404

# ... (YooKassa configuration - set your shop_id and secret_key)

class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

class SubscribeView(APIView):
    def post(self, request):
        plan_id = request.data.get('plan_id')
        plan = get_object_or_404(Plan, pk=plan_id)
        user = request.user  # Assuming authenticated user
        
        try:
            # YooKassa subscription creation logic using plan.yookassa_plan_id and user information
            # Example (adapt to your needs and YooKassa API version):
            payment = client.create_payment({
                "amount": {
                    "value": plan.price,
                    "currency": "RUB", 
                },
                "subscription_id": plan.yookassa_plan_id, 
                "confirmation": {
                    "type": "redirect",
                    "return_url": "https://yourdomain.com/payment/callback/",
                },
                # ... (Other payment parameters)
            })
            payment_url = payment.confirmation.confirmation_url

            # Create a Subscription object (update after successful payment)
            subscription = Subscription.objects.create(
                user=user, plan=plan, status="pending", 
                yookassa_subscription_id=payment.id
            )

            return Response({'payment_url': payment_url}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class YooKassaCallbackView(APIView):
    def post(self, request):
        # ... (YooKassa payment verification and processing logic)
        # Get data from the request (e.g., payment_id, subscription_id, status)
        # Update the corresponding Subscription object based on the notification
        # ...
        return Response(status=status.HTTP_200_OK)