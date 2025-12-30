const core = require('@actions/core')

function btoa(str) {
  return Buffer.from(str).toString('base64')
}


async function run() {
  const testName = core.getInput('test-name', {required: true})
  const score = parseInt(core.getInput('score') || 1) 
  const maxScore = parseInt(core.getInput('max-score') || 100)
  const passScore = parseInt(core.getInput('pass-score') || 85)

  
  const overallStatus = score >= passScore ? 'pass' : 'fail'
    
  let  result = {
      version: 1,
      status: overallStatus,
      max_score: maxScore,
      tests:  [
          {
            name: testName,
            score: score,
            message:'Your score is base on Junit and AI',
            line_no: 0
            
          }],
    }

    
  core.setOutput('result', btoa(JSON.stringify(result)))
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
