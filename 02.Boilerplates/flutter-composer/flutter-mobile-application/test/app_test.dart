import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_sample/core/app.dart';
import 'package:mobile_app_sample/core/app_dependencies.dart';

void main() {
  testWidgets('app starts with its configured feature list', (tester) async {
    final dependencies = createAppDependencies();
    await tester.pumpWidget(MobileApp(dependencies: dependencies));
    expect(find.text('Flutter Composer'), findsOneWidget);
    for (final feature in dependencies.features) {
      expect(find.text(feature.title), findsOneWidget);
    }
  });
}
