import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_sample/scenes/counter/counter_feature.dart';
import 'package:mobile_app_sample/scenes/counter/counter_view_model.dart';

void main() {
  test('counter publishes increments', () {
    final viewModel = CounterViewModel();
    addTearDown(viewModel.dispose);
    var notifications = 0;
    viewModel.addListener(() => notifications++);
    viewModel.increment();
    expect(viewModel.value, 1);
    expect(notifications, 1);
  });

  testWidgets('counter screen increments its injected model', (tester) async {
    final feature = createCounterFeature();
    addTearDown(feature.dispose);
    await tester.pumpWidget(MaterialApp(home: feature.screen));
    await tester.tap(find.byType(FloatingActionButton));
    await tester.pump();
    expect(find.text('1'), findsOneWidget);
  });
}
