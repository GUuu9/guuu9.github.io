import '../../core/app_feature.dart';
import 'counter_scene.dart';
import 'counter_view_model.dart';

AppFeature createCounterFeature() {
  final viewModel = CounterViewModel();
  return AppFeature(
    id: 'counter',
    title: '카운터',
    screen: CounterScene(viewModel: viewModel),
    dispose: viewModel.dispose,
  );
}
