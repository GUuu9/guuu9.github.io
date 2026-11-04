import 'package:flutter/services.dart';

class GreetingApi {
  const GreetingApi(this._bundle);

  final AssetBundle _bundle;

  Future<String> readGreeting() =>
      _bundle.loadString('lib/resource/greeting.json');
}
