import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_sample/core/app.dart';
import 'package:mobile_app_sample/core/app_dependencies.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_service.dart';

class _GreetingService implements GreetingService {
  @override
  Future<String> loadGreeting() async => '화면 테스트 인사';
}

void main() {
  testWidgets('default dependencies load the bundled greeting', (tester) async {
    await tester.pumpWidget(MobileApp(dependencies: createAppDependencies()));

    await tester.tap(find.text('불러오기'));
    await tester.runAsync(() async {
      await rootBundle.loadString('lib/resource/greeting.json');
    });
    await tester.pumpAndSettle();

    expect(find.text('안녕하세요, Flutter!'), findsOneWidget);
  });

  testWidgets('button loads and displays a greeting', (tester) async {
    await tester.pumpWidget(
      MobileApp(
        dependencies: createAppDependencies(
          greetingService: _GreetingService(),
        ),
      ),
    );

    await tester.tap(find.text('불러오기'));
    await tester.pumpAndSettle();

    expect(find.text('화면 테스트 인사'), findsOneWidget);
  });
}
