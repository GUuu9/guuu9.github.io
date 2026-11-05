import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_model.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_service.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_view_model.dart';

class _SuccessGreetingService implements GreetingService {
  @override
  Future<String> loadGreeting() async => '테스트 인사';
}

class _FailingGreetingService implements GreetingService {
  @override
  Future<String> loadGreeting() async => throw StateError('private detail');
}

class _DeferredGreetingService implements GreetingService {
  final result = Completer<String>();

  @override
  Future<String> loadGreeting() => result.future;
}

void main() {
  test('disposed model does not publish an async completion', () async {
    final service = _DeferredGreetingService();
    final viewModel = GreetingViewModel(service);
    var notifications = 0;
    viewModel.addListener(() => notifications++);
    final pending = viewModel.loadGreeting();
    viewModel.dispose();
    service.result.complete('late result');
    await pending;
    expect(notifications, 1);
  });

  test('loadGreeting publishes the loaded message', () async {
    final viewModel = GreetingViewModel(_SuccessGreetingService());
    addTearDown(viewModel.dispose);

    await viewModel.loadGreeting();

    expect(viewModel.status, GreetingStatus.loaded);
    expect(viewModel.greeting, '테스트 인사');
    expect(viewModel.errorMessage, isNull);
  });

  test('loadGreeting exposes a safe error and can be retried', () async {
    final viewModel = GreetingViewModel(_FailingGreetingService());
    addTearDown(viewModel.dispose);

    await viewModel.loadGreeting();

    expect(viewModel.status, GreetingStatus.failed);
    expect(viewModel.errorMessage, '인사를 불러오지 못했습니다.');
    expect(viewModel.errorMessage, isNot(contains('private detail')));
  });
}
