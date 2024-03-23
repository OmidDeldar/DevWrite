const stubs = {};

stubs.cpp = `#include <iostream>
using namespace std;

int main() {
    std::cout<<"Hello World";
    return 0;
}
`;

stubs.python = `# python3

import sys
sys.stdin  = open(sys.argv[1])
# keep the above lines to take user input

print("Hello World !!!")`;


stubs.java = `public class Main
{
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}`

stubs.javascript = `print('Hello World');`

export default stubs;
