abstract interface class GreetingService {
  Future<String> loadGreeting();
}

class LocalGreetingService implements GreetingService {
  @override
  Future<String> loadGreeting() async => '안녕하세요, Flutter!';
}
