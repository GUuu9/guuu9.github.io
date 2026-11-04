import 'package:flutter/material.dart';

import 'greeting_model.dart';
import 'greeting_view_model.dart';

class GreetingScene extends StatelessWidget {
  const GreetingScene({super.key, required this.viewModel});

  final GreetingViewModel viewModel;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: viewModel,
      builder: (context, _) {
        final message = switch (viewModel.status) {
          GreetingStatus.idle => '버튼을 눌러 인사를 불러오세요.',
          GreetingStatus.loading => '불러오는 중…',
          GreetingStatus.loaded => viewModel.greeting!,
          GreetingStatus.failed => viewModel.errorMessage!,
        };

        return Scaffold(
          appBar: AppBar(title: const Text('인사 샘플')),
          body: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(message, key: const Key('greeting-message')),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: viewModel.status == GreetingStatus.loading
                      ? null
                      : viewModel.loadGreeting,
                  child: const Text('불러오기'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
