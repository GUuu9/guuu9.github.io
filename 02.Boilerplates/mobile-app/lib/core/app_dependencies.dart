import 'package:flutter/services.dart';

import '../apis/greeting_api.dart';
import '../scenes/greeting/greeting_service.dart';
import '../scenes/greeting/greeting_view_model.dart';

class AppDependencies {
  const AppDependencies({required this.greetingViewModel});

  final GreetingViewModel greetingViewModel;

  void dispose() => greetingViewModel.dispose();
}

AppDependencies createAppDependencies({GreetingService? greetingService}) {
  return AppDependencies(
    greetingViewModel: GreetingViewModel(
      greetingService ?? AssetGreetingService(GreetingApi(rootBundle)),
    ),
  );
}
