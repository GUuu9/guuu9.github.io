import 'package:flutter/foundation.dart';

import '../data/greeting_service.dart';

enum GreetingStatus { idle, loading, loaded, failed }

class GreetingViewModel extends ChangeNotifier {
  GreetingViewModel(this._service);

  final GreetingService _service;

  GreetingStatus status = GreetingStatus.idle;
  String? greeting;
  String? errorMessage;

  Future<void> loadGreeting() async {
    if (status == GreetingStatus.loading) return;

    status = GreetingStatus.loading;
    errorMessage = null;
    notifyListeners();

    try {
      greeting = await _service.loadGreeting();
      status = GreetingStatus.loaded;
    } on Object {
      status = GreetingStatus.failed;
      errorMessage = '인사를 불러오지 못했습니다.';
    }

    notifyListeners();
  }
}
