## GitHub Classroom Command Grader

### Overview
**GitHub Classroom Command Grader** is a plugin for GitHub Classroom's Autograder. Seamlessly integrate your CS class with GitHub using this action to facilitate the grading process.

### Key Features
Take the score from score parameter.
### Inputs

| Input Name   | Description                                      | Required |
|--------------|--------------------------------------------------|----------|
| `test-name`  | The unique identifier for the test.              | Yes      |
| `score`      | Points awarded for the test if it passes.        | No       |
| `max-score`  | Maximum possible score for the assignment.       | No       |
| `pass-score` | The score threshold to pass the test.            | No       |

### Outputs

| Output Name | Description                        |
|-------------|------------------------------------|
| `result`    | Outputs the result of the grader, indicating the success or failure of the test.  |

### Usage

1. Add the GitHub Classroom Command Grader action to your workflow.

```
name: Autograding Tests
on:
  - workflow_dispatch
  - repository_dispatch
permissions:
  checks: write
  actions: read
  contents: read
jobs:
  run-autograding-tests:
    runs-on: ubuntu-latest
    if: github.actor != 'github-classroom[bot]'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: autograding-command-grader
        if: always()
        id: run-tests
        uses: baraksu-class-2026/autograding-command-grader@v1
        with:
          test-name: Junit And AI.
          score: ${{ steps.ai_review.outputs.adjusted_grade || steps.grade.outputs.grade }}
          max-score: 100
          score-pass: 80
      - name: Autograding Reporter
        uses: classroom-resources/autograding-grading-reporter@v1
        env:
          RUN-TESTS_RESULTS: "${{steps.run-tests.outputs.result}}"
        with:
          runners: run-tests
```
