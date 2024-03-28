const stubs = {};

stubs.cpp = `#include <iostream>
using namespace std;

int main() {
    std::cout<<"Hello World";
    return 0;
}
`;

stubs.python = `# python3

name = input()
print ('Hello ',name)`;


stubs.java = `public class Main
{
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}`

stubs.javascript = `console.log('Hello World');`

export default stubs;
