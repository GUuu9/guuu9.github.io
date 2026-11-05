import 'dart:convert';

import '../../apis/greeting_api.dart';

abstract interface class GreetingService {
  Future<String> loadGreeting();
}

class AssetGreetingService implements GreetingService {
  const AssetGreetingService(this._api);

  final GreetingApi _api;

  @override
  Future<String> loadGreeting() async {
    final data = jsonDecode(await _api.readGreeting());
    final message = data is Map<String, dynamic> ? data['message'] : null;
    if (message is! String || message.trim().isEmpty) {
      throw const FormatException('Invalid greeting resource');
    }
    return message;
  }
}
