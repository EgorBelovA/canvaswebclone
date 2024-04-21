from django.test import TestCase
from .serializers import UserRegistrationSerializer

class UserRegistrationSerializerTests(TestCase):
    def setUp(self):
        self.clean_data = {'email': 'test@test.com', 'password': 'Test1234', 'first_name': 'Test'}

    def test_create_user(self):
        serializer = UserRegistrationSerializer(data=self.clean_data)
        serializer.is_valid()
        user_obj = serializer.save()

        self.assertEqual(user_obj.email, self.clean_data['email'])
        self.assertTrue(user_obj.check_password(self.clean_data['password']))
        self.assertEqual(user_obj.first_name, self.clean_data['first_name'])
        # self.assertFalse(user_obj.is_active)

    def test_create_user_invalid_data(self):
        serializer = UserRegistrationSerializer(data={'email': 'test'})
        self.assertFalse(serializer.is_valid())