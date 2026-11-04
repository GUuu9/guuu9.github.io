import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_sample/app.dart';
import 'package:mobile_app_sample/core/di/app_dependencies.dart';
import 'package:mobile_app_sample/features/greeting/data/greeting_service.dart';

class _GreetingService implements GreetingService {
  @override
  Future<String> loadGreeting() async => '화면 테스트 인사';
}

void main() {
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
