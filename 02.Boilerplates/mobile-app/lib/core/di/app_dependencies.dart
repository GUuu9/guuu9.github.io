import '../../features/greeting/data/greeting_service.dart';
import '../../features/greeting/presentation/greeting_view_model.dart';

class AppDependencies {
  const AppDependencies({required this.greetingViewModel});

  final GreetingViewModel greetingViewModel;

  void dispose() => greetingViewModel.dispose();
}

AppDependencies createAppDependencies({GreetingService? greetingService}) {
  return AppDependencies(
    greetingViewModel: GreetingViewModel(
      greetingService ?? LocalGreetingService(),
    ),
  );
}
