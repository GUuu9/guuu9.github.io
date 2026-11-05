import 'package:flutter/services.dart';

import '../../apis/greeting_api.dart';
import '../../core/app_feature.dart';
import 'greeting_scene.dart';
import 'greeting_service.dart';
import 'greeting_view_model.dart';

AppFeature createGreetingFeature() {
  final viewModel = GreetingViewModel(
    AssetGreetingService(GreetingApi(rootBundle)),
  );
  return AppFeature(
    id: 'greeting-resource',
    title: '인사 리소스',
    screen: GreetingScene(viewModel: viewModel),
    dispose: viewModel.dispose,
  );
}
