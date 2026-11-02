import 'package:flutter/material.dart';

import 'core/di/app_dependencies.dart';
import 'features/greeting/presentation/greeting_view.dart';

class MobileApp extends StatefulWidget {
  const MobileApp({super.key, required this.dependencies});

  final AppDependencies dependencies;

  @override
  State<MobileApp> createState() => _MobileAppState();
}

class _MobileAppState extends State<MobileApp> {
  @override
  void dispose() {
    widget.dependencies.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter MVVM Sample',
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: GreetingView(viewModel: widget.dependencies.greetingViewModel),
    );
  }
}
