import 'package:flutter/material.dart';

import 'app_dependencies.dart';

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
      title: 'Flutter Composer',
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: Builder(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Flutter Composer')),
          body: widget.dependencies.features.isEmpty
              ? const Center(child: Text('feature를 추가해 화면을 시작하세요.'))
              : ListView(
                  children: [
                    for (final feature in widget.dependencies.features)
                      ListTile(
                        title: Text(feature.title),
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => feature.screen,
                          ),
                        ),
                      ),
                  ],
                ),
        ),
      ),
    );
  }
}
