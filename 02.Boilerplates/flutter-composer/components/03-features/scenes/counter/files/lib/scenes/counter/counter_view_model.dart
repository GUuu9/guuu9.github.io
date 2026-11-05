import 'package:flutter/foundation.dart';

class CounterViewModel extends ChangeNotifier {
  int _value = 0;
  int get value => _value;

  void increment() {
    _value++;
    notifyListeners();
  }
}
