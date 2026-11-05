import 'package:flutter/material.dart';

import 'counter_view_model.dart';

class CounterScene extends StatelessWidget {
  const CounterScene({super.key, required this.viewModel});

  final CounterViewModel viewModel;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('카운터')),
    body: Center(
      child: AnimatedBuilder(
        animation: viewModel,
        builder: (_, _) => Text('${viewModel.value}'),
      ),
    ),
    floatingActionButton: FloatingActionButton(
      onPressed: viewModel.increment,
      child: const Icon(Icons.add),
    ),
  );
}
