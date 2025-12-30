const process = require('process')
const cp = require('child_process')
const path = require('path')

const np = process.execPath
const ip = path.join(__dirname, '..', 'src', 'main.js')

function runTestWithEnv(env) {
  const options = {
    env: {
      ...process.env,
      ...env,
    },
    encoding: 'utf-8',
  }
  const child = cp.spawnSync(np, [ip], options)
  const stdout = child.stdout.toString()
  const encodedResult = stdout.split('::set-output name=result::')[1].trim()
  return JSON.parse(atob(encodedResult))
}

function atob(str) {
  return Buffer.from(str, 'base64').toString('utf8')
}

test('validates score input is used correctly', () => {
  const result = runTestWithEnv({
    'INPUT_TEST-NAME': 'Score Test',
    INPUT_SCORE: '85',
    'INPUT_MAX-SCORE': '100',
  })

  expect(result.tests[0].name).toBe('Score Test')
  expect(result.tests[0].score).toBe(85)
  expect(result.max_score).toBe(100)
})

test('validates pass-score threshold with passing score', () => {
  const result = runTestWithEnv({
    'INPUT_TEST-NAME': 'Pass Threshold Test',
    INPUT_SCORE: '85',
    'INPUT_PASS-SCORE': '80',
  })

  expect(result.tests[0].name).toBe('Pass Threshold Test')
  expect(result.tests[0].status).toBe('pass')
  expect(result.tests[0].score).toBe(85)
})

test('validates pass-score threshold with failing score', () => {
  const result = runTestWithEnv({
    'INPUT_TEST-NAME': 'Fail Threshold Test',
    INPUT_SCORE: '75',
    'INPUT_PASS-SCORE': '80',
  })

  expect(result.tests[0].name).toBe('Fail Threshold Test')
  expect(result.tests[0].status).toBe('fail')
  expect(result.tests[0].score).toBe(75)
})

test('validates output result structure', () => {
  const result = runTestWithEnv({
    'INPUT_TEST-NAME': 'Output Structure Test',
    INPUT_SCORE: '90',
    'INPUT_MAX-SCORE': '100',
  })

  expect(result).toHaveProperty('status')
  expect(result).toHaveProperty('tests')
  expect(result).toHaveProperty('max_score')
  expect(Array.isArray(result.tests)).toBe(true)
  expect(result.tests[0]).toHaveProperty('name')
  expect(result.tests[0]).toHaveProperty('status')
  expect(result.tests[0]).toHaveProperty('score')
})

test('validates test with all inputs provided', () => {
  const result = runTestWithEnv({
    'INPUT_TEST-NAME': 'Complete Test',
    INPUT_SCORE: '95',
    'INPUT_MAX-SCORE': '100',
    'INPUT_PASS-SCORE': '90',
  })

  expect(result.tests[0].name).toBe('Complete Test')
  expect(result.tests[0].score).toBe(95)
  expect(result.tests[0].status).toBe('pass')
  expect(result.max_score).toBe(100)
})

test('validates default score when score not provided', () => {
  const result = runTestWithEnv({
    'INPUT_TEST-NAME': 'Default Score Test',
    'INPUT_MAX-SCORE': '100',
  })

  expect(result.tests[0].name).toBe('Default Score Test')
  expect(result.tests[0].score).toBeDefined()
  expect(result.max_score).toBe(100)
})
