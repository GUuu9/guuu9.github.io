import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app_sample/apis/greeting_api.dart';
import 'package:mobile_app_sample/scenes/greeting/greeting_service.dart';

class _JsonBundle extends CachingAssetBundle {
  _JsonBundle(this.content);

  final String content;

  @override
  Future<ByteData> load(String key) async {
    expect(key, 'lib/resource/greeting.json');
    return ByteData.sublistView(Uint8List.fromList(utf8.encode(content)));
  }
}

void main() {
  test('API and service read a valid greeting resource', () async {
    final service = AssetGreetingService(
      GreetingApi(_JsonBundle('{"message":"리소스 인사"}')),
    );

    expect(await service.loadGreeting(), '리소스 인사');
  });

  test('service rejects malformed JSON and invalid messages', () async {
    for (final content in [
      '{',
      '[]',
      '{}',
      '{"message":1}',
      '{"message":" "}',
    ]) {
      final service = AssetGreetingService(GreetingApi(_JsonBundle(content)));
      await expectLater(service.loadGreeting(), throwsFormatException);
    }
  });
}
