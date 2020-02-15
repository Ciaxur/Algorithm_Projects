#include "Genome.hpp"
#include <vector>

/**
 * Simple Structure for Pair Values
 */
template <typename F, typename S> struct Pair {
    F first;
    S second;
};


class GeneticAlgorithm {

  private: // Private Varialbes
    int popSize, geneLen;
    float crossoverRate, mutationRate;
    vector<Genome *> population;

    

  public: // Public Methods
    /**
     * Creates a Genetic Algorithm Object with given
     *  parameters as properties to run the Algorithm
     *
     * @param _popSize - The Population Size
     * @param _geneLen - The Length of the Gene
     * @param _crossRate - The Rate for Single-Point Crossover
     * @param _mutRate - The Rate for Mutation
     */
    GeneticAlgorithm(int _popSize, int _geneLen, float _crossRate, float _mutRate) {
        // Store Data
        popSize = _popSize;
        crossoverRate = _crossRate;
        mutationRate = _mutRate;
		geneLen = _geneLen;

        // Initiate Initial Population
        population = makePopulation(_popSize, _geneLen);
    }

    /**
     * Deconstruct Data in Memory
     */
    ~GeneticAlgorithm() {
        // Free up Memory
        killPopulation(population);
    };

    /**
     * Creates a new Population with given size and length of genome
     *
     * @param _popSize - The Size of the Population
     * @param _geneLen - The Length of each Genome
     * @returns - A Vector with the population
     */
    vector<Genome *> makePopulation(int _popSize, int _geneLen) {
        // Create the vector
        vector<Genome *> vec;
        vec.resize(_popSize);

        // Generate the Population
        for (int i = 0; i < _popSize; i++) {
            vec[i] = new Genome(_geneLen);
        }

        // Return new Population
        return vec;
    }

    /**
     * Calculates the Fitness of the Genome
     *  based on the number of 1's
     *
     * @param genome - The Genome to check fitness of
     * @returns - Fitness Score of Genome
     */
    int fitness(Genome &genome) {
        // Set an Initial Fitness Value
        int fit = 0;

        // Count the number of 1's in the Genome
        for (int i = 0; i < genome.size(); i++) {
            if (genome.get(i) == 1)
                fit += 1;
        }

        // Return the Calculated Fitness Score
        return fit;
    }

    /**
     * Calculates the Overall Population Average Fitness
     *  and the best Fit Genome in the Population
     *
     * @param population - The Genome Population
     * @returns - Pair of <overall average fitness, best fit>
     */
    Pair<float, int> evaluateFitness(vector<Genome *> &population) {
        // Create the Fitness Pair
        // First Pair -> Overall Average Fitness of Population
        // Second Pair -> Best Fit Genome in Population
        Pair<float, int> fitPair = {0, 0};

        // Check entire Population
        for (int i = 0; i < population.size(); i++) {
            // Get the Fit Score of Genome
            int score = fitness(*population[i]);

            // Accumulate Overall Population Fit Score
            fitPair.first += score;

            // Check if Best Fit
            if (score > fitPair.second) {
                fitPair.second = score;
            }
        }

        // Average out the Overall Population Fitness
        fitPair.first /= population.size();

        // Return the Pair Results
        return fitPair;
    }

    /**
     * Returns a pair of Genomes using Fitness-Proportionate Selection
     *  (Roulette Wheel)
     *
     * @param population - The Genome Population
     * @returns - A Pair of Genomes
     */
    Pair<Genome *, Genome *> selectPair(vector<Genome *> &population) {
        // Obtain Fittest
		int sumFit = 0;
		for (Genome* gene : population) {
			sumFit += fitness(*gene);
		}

		// Create the Genome Pair
		Pair<Genome*, Genome*> genPair = { nullptr, nullptr };

        // Roulette Wheel Algorithm
		bool firstDone = false;				// Keep track of first Genome Pair

		// Get Genome Pair
		for (int j = 0; j < 2; j++) {
			// Pick a Random Number in the range of the Sum Fitness
			int randVal = rand() % sumFit;

			// Decrement Random Value until less than 0 (CHOSEN GENOME)
			int i = 0;
			for (; population.size(); i++) {
				randVal -= fitness(*population[i]);

				if (randVal <= 0) 
					break;
			}
			
			if (!firstDone) {
				genPair.first = population[i];
				firstDone = true;
			}
			else {
				genPair.second = population[i];
			}
		}

		// Return the Pair
        return genPair;
    }

    /**
     * Creates two new Genomes by crossing over the given
     *  two genomes
     *
     * @param gene1 - Genome 1
     * @param gene2 - Genome 2
     * @returns - Pair of New Crossover Genomes
     */
    Pair<Genome *, Genome *> crossover(Genome &gene1, Genome &gene2) {
        // Create the Genome Pairs
        Pair<Genome *, Genome *> genePair = {new Genome(gene1), new Genome(gene2)};

        // Generate a Random Crossover Point
        int crossPoint = rand() % gene1.size();

        // Perform Crossover at Point
        int temp;
        for (int i = crossPoint; i < genePair.first->size(); i++) {
            temp = genePair.first->get(i);
            genePair.first->set(i, genePair.second->get(i));
            genePair.second->set(i, temp);
        }

        // Return newly created Genome Pairs
        return genePair;
    }

    /**
     * Mutates given Genome based on a Mutation Rate
     *  and returns a NEW Genome (Deep Copy)
     *
     * @param gene - Genome to apply Mutation to
     * @param rate - The Mutation Rate
     * @returns - New Genome with Mutated Data
     */
    Genome *mutate(Genome gene, float &rate) {
        // Create a Deep Copy of the Given Genome
        Genome *newGene = new Genome(gene);

        // Loop through the Gene
        for (int i = 0; i < newGene->size(); i++) {
            // Generate a random Value between 0 and 1
            float randVal = static_cast<float>(rand()) / static_cast<float>(RAND_MAX);

            // If the random value is less than the Rate, MUTATE!
            if (randVal <= rate) {
                newGene->set(i, rand() % 2); // Mutate randomly 0 or 1
            }
        }

        // Return the new Genome
        return newGene;
    }

    /**
     * Runs the Genetic Algorithm for given Runs
     *
     * @param maxRuns - Runs to Perform
     */
    void runGA(unsigned maxRuns) {
		// Keep track of Data
		bool crossCreated = false;		// Keep track of Crossover Creation State
		bool goalReached = false;		// Keep Track of Goal

		// Perform 'r' Runs
		// End if Goal Reached
		for (int r = 0; r < maxRuns && !goalReached; r++) {
			// Create the Next Generation Pool
			vector<Genome*> nextGeneration;
			for (int i = 0; i < population.size(); i++) {
				// Get the Best Pair in the Population
				Pair<Genome*, Genome*> genePair = selectPair(population);


				// Crossover?
				float randVal = static_cast<float>(rand()) / static_cast<float>(RAND_MAX);
				if (randVal <= crossoverRate) {
					genePair = crossover(*genePair.first, *genePair.second);
					crossCreated = true;
				}

				// Mutate?
				nextGeneration.push_back(mutate(*genePair.first, mutationRate));
				nextGeneration.push_back(mutate(*genePair.second, mutationRate));


				// Free up Memory (If Crossover Occured)
				if (crossCreated) {
					delete genePair.first;
					delete genePair.second;
					crossCreated = false;
				}

				// Make sure Population doesn't exceed 50!
				if (nextGeneration.size() >= popSize)
					break;
			}

			// Output Population Summary
			if (printSummary(r, population))
				goalReached = true;

			// Kill Current Population
			killPopulation(population);

			// Set new Population as Current
			population = nextGeneration;
		}
	}



  private: // Private Methods (Helper Functions)
	/**
	 * Outputs the Summary of the Population of Generation Given
	 *  Checks if goal Reached
	 * 
	 * @param genCount - The Generation Number
	 * @param pop - The Population
	 * @returns - State of Goal Reached
	 */
	bool printSummary(int genCount, vector<Genome*> &pop) {
		// Evaluate the Fitness of Population
		Pair<float, int> eval = evaluateFitness(pop);

		cout << "Generation[" << genCount << "]: ";
		cout << "Average Fitness: " << eval.first;
		cout << ", Best Fitness: " << eval.second << endl;

// Make sure Defined Macro
#ifdef EXTRA_SUMMARY
		if (EXTRA_SUMMARY) {
			cout << "\tBest Fit Gene: [ ";

			// Find Best Genome
			Genome* bestGene = population[0];
			int highscore = 0;
			for (Genome* gene : population) {
				int fit = fitness(*gene);

				if (fit > highscore) {
					highscore = fit;
					bestGene = gene;
				}
			}

			// Output Genome Data
			printGene(bestGene);
			cout << "]\n";
		}
#endif // EXTRA_SUMMARY

		// Check if Goal Reached
		return (eval.second == geneLen);
	}

    /** DEBUG:
     * Outputs each Genome in the Population with
     *  their fitness scores
     */
    void printPopulation(vector<Genome *> &pop) {
        for (int i = 0; i < pop.size(); i++) {
            cout << "Gene[" << i << "] = ";
            printGene(pop[i]);
            cout << " Fitness: " << fitness(*pop[i]) << endl;
        }
    }

    /** DEBUG:
     * Outputs given Genome in sequence order (One after the other)
     *  Space Seperated
     *
     * @param gene - The Genome to print
     */
    void printGene(Genome *gene) {
        for (int j = 0; j < gene->size(); j++) {
            cout << gene->get(j) << ' ';
        }
    }

	/**
	 * Removes Population from Memory
	 *
	 * @param pop - The population to Remove
	 */
	void killPopulation(vector<Genome*> pop) {
		for (int i = population.size() - 1; i >= 0; i--) {
			delete population[i];
		}

		// Resize Population to 0
		population.resize(0);
	}
};