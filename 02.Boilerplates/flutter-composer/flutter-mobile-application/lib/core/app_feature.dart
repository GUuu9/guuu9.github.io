import 'package:flutter/widgets.dart';

/// DI 조립에서 소유하며 앱 종료 때 해제하는 선택 화면입니다.
class AppFeature {
  const AppFeature({
    required this.id,
    required this.title,
    required this.screen,
    required this.dispose,
  });

  final String id;
  final String title;
  final Widget screen;
  final VoidCallback dispose;
}
