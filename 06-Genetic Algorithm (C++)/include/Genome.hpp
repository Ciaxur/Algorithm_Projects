#include <cstdlib>
#include <ctime>
#include <iostream>
using namespace std;

class Genome {
  private:
    int length;
    int *data;

  public:
    /**
     * Constructs a Random Genome with given Size
     */
    Genome(const int size) {
        // Create a Random Genome
        randomGenome(size);
    };

    /**
     * Creates a Deep copy of given Gene
     */
    Genome(Genome &gene) {
        // Store length
        length = gene.length;

        // Create Data
        data = new int[length];

        // Deep Copy the Data
        for (int i = 0; i < length; i++) {
            data[i] = gene.data[i];
        }
    }

    /**
     * Deconstruct Data in Memory
     */
    ~Genome() {
        // Free up Data Memory
        delete[] data;
    };

    /**
     * Randomizes the current object's Genome
     */
    void randomGenome(const int len) {
        // Make sure Data is Empty
        if (data) {
            delete[] data;
        }

        // Set length of Genome
        length = len;

        // Create an Array with given length
        data = new int[len];

        // Set Random Values (0 or 1) into Genome
        for (int i = 0; i < len; i++) {
            data[i] = rand() % 2;
        }
    };

    /**
     * Outputs Genome for Debugging Purposes
     */
    void printGenome() {
        for (int i = 0; i < length; i++) {
            cout << "Gene[" << i << "] = " << data[i] << endl;
        }
    };

    /**
     * Returns the Length of the Genome
     */
    int size() { return length; }

    // Getters and Setters
    int &get(int index) { return data[index]; }
    void set(int index, int newVal) { data[index] = newVal; }
};