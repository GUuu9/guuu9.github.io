import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_scene.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_view_model.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_feature.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_service.dart';

class _GreetingService implements GreetingService {
  @override
  Future<String> loadGreeting() async => '화면 테스트 인사';
}

void main() {
  testWidgets('default dependencies load the bundled greeting', (tester) async {
    final feature = createGreetingFeature();
    addTearDown(feature.dispose);
    await tester.pumpWidget(MaterialApp(home: feature.screen));

    await tester.tap(find.text('불러오기'));
    await tester.runAsync(() async {
      await rootBundle.loadString('lib/resource/greeting.json');
    });
    await tester.pumpAndSettle();

    expect(find.text('안녕하세요, Flutter!'), findsOneWidget);
  });

  testWidgets('button loads and displays a greeting', (tester) async {
    final viewModel = GreetingViewModel(_GreetingService());
    addTearDown(viewModel.dispose);
    await tester.pumpWidget(
      MaterialApp(home: GreetingScene(viewModel: viewModel)),
    );

    await tester.tap(find.text('불러오기'));
    await tester.pumpAndSettle();

    expect(find.text('화면 테스트 인사'), findsOneWidget);
  });
}
