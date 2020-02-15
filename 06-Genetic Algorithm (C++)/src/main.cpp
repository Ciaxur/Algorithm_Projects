#define EXTRA_SUMMARY true			// Displays Extra Data to Summaries
#include "../include/GeneticAlgorithm.hpp"


int main() {
    // Initiate Random number generator
    srand(time(0));

	// Create Variables for Genetic Algorithm
	const int popSize = 50;
	const int geneLength = 10;
	const float crossoverRate = 0.7f;	// Default = 0.7
	const float mutationRate = 0.001f;

	// Output Basic Details
	cout << "Population Size: " << popSize << endl;
	cout << "Genome Length: " << geneLength << endl << endl;

	// Create the Genetic Algorithm & Begin
    GeneticAlgorithm ga(popSize, geneLength, crossoverRate, mutationRate);
    ga.runGA(30);
}