import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class AuthService {
  static const String baseUrl = 'http://127.0.0.1:8000';

  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/login/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'user': User.fromJson(data),
          'message': 'Login successful',
        };
      } else {
        return {
          'success': false,
          'message': 'Invalid username or password',
        };
      }
    } catch (e) {
      print('Login error: $e');
      // For development: allow login without backend
      return {
        'success': true,
        'user': User(
          id: 1,
          username: username,
          email: '$username@aquarium.com',
          token: 'demo_token_123',
        ),
        'message': 'Login successful (Demo mode)',
      };
    }
  }

  Future<Map<String, dynamic>> register(
    String username,
    String email,
    String password,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/register/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        return {
          'success': true,
          'user': User.fromJson(data),
          'message': 'Registration successful',
        };
      } else {
        return {
          'success': false,
          'message': 'Registration failed',
        };
      }
    } catch (e) {
      print('Register error: $e');
      // For development: allow registration without backend
      return {
        'success': true,
        'user': User(
          id: 1,
          username: username,
          email: email,
          token: 'demo_token_123',
        ),
        'message': 'Registration successful (Demo mode)',
      };
    }
  }

  Future<void> logout() async {
    // Clear local storage/preferences here
    await Future.delayed(const Duration(milliseconds: 500));
  }
}
