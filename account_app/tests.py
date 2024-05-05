from django.test import TestCase
from .serializers import UserRegistrationSerializer
from .models import CustomUser
from rest_framework import status
from django.urls import reverse

# class UserRegistrationSerializerTests(TestCase):
#     def setUp(self):
#         self.clean_data = {'email': 'test@test.com', 'password': 'Test1234', 'first_name': 'Test'}

#     def test_create_user(self):
#         serializer = UserRegistrationSerializer(data=self.clean_data)
#         serializer.is_valid()
#         user_obj = serializer.save()

#         self.assertEqual(user_obj.email, self.clean_data['email'])
#         self.assertTrue(user_obj.check_password(self.clean_data['password']))
#         self.assertEqual(user_obj.first_name, self.clean_data['first_name'])
#         # self.assertFalse(user_obj.is_active)

#     def test_create_user_invalid_data(self):
#         serializer = UserRegistrationSerializer(data={'email': 'test'})
#         self.assertFalse(serializer.is_valid())


# class UserViewTests(TestCase):
#     def setUp(self):
#         self.user = CustomUser.objects.create_user(
#             email='test@gmail.com',
#             first_name='test',
#             password='secret'
#         )

#     def test_get_user_authenticated(self):
#         """Test getting user when authenticated"""
#         url = reversed('user-view')
#         self.client.force_login(self.user)        
#         response = self.client.get(url)        
#         self.assertEqual(response.status_code, status.HTTP_200_OK)        
#         self.assertEqual(response.data['user']['email'], self.user.email)

#     def test_get_user_unauthenticated(self):
#         """Test getting user when not authenticated"""        
#         url = reverse('user-view')
#         response = self.client.get(url)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)