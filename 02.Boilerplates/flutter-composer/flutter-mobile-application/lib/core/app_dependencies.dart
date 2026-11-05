import 'app_feature.dart';
import 'features.g.dart';

class AppDependencies {
  const AppDependencies({required this.features});

  final List<AppFeature> features;

  void dispose() {
    for (final feature in features) {
      feature.dispose();
    }
  }
}

AppDependencies createAppDependencies() =>
    AppDependencies(features: createFeatures());
