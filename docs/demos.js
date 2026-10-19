// Reconstructed teaching controls; all calculations run locally.
document.querySelectorAll('[data-demo]').forEach(demo => {
  const input = name => demo.querySelector(`[data-field="${name}"]`);
  const number = name => Number(input(name).value);
  const put = (name, value) => { demo.querySelector(`[data-value="${name}"]`).textContent = value; };
  let step = 0;
  const stages = [
    ['QUEUED', '任务进入队列，等待 Worker 领取。'],
    ['RUNNING', 'Worker 领取任务，获得执行租约并恢复工作目录。'],
    ['RUNNING', '读取代码并定位幂等性问题；保存检查点。'],
    ['RETRY_PENDING', 'Worker 崩溃，租约到期。持久化状态仍保留。'],
    ['RUNNING', '新 Worker 从检查点恢复；使用幂等键避免重复副作用。'],
    ['RUNNING', '修改代码并运行测试，记录工具执行结果。'],
    ['WAITING_APPROVAL', '创建 Pull Request 前等待授权，暂停执行。'],
    ['RUNNING', '模拟收到授权，执行最终操作并核对验收条件。'],
    ['COMPLETED', '验收通过，任务结束。此演示未执行任何真实工具。']
  ];
  function update() {
    switch (demo.dataset.demo) {
      case 'diffusion': put('tokens', number('tokens').toLocaleString()); put('rounds', number('rounds')); break;
      case 'runtime':
        put('state', stages[step][0]); put('step', `${step+1} / ${stages.length}`); put('event', stages[step][1]);
        demo.querySelector('[data-action="next"]').disabled = step === stages.length-1; break;
      case 'routing': {
        const routes = [
          ['规则 / 小模型', '测试状态明确时优先解析结构化结果；含歧义时使用经过评测的小模型。', 1],
          ['代码模型', '优先选择经过代码任务评测的低成本代码模型，失败后升级。', 2],
          ['推理模型', '复杂跨服务因果分析交给推理模型，并要求用日志和测试验证结论。', 5],
          ['小模型', '常规日志摘要优先小模型；若需要跨日志诊断，再升级分析路线。', 1]
        ];
        const r = routes[number('task')]; put('route',r[0]);put('reason',r[1]);put('cost',`${r[2]} 单位`);break;
      }
      case 'memory':
        put('params',`${number('params')}B`);
        put('weights',`${(number('params')*number('bits')/8).toFixed(2)} GB`);
        put('cache',`${(2*28*4*128*number('context')*2/2**30).toFixed(2)} GiB`);break;
      case 'tools': {
        const lazy=2000+number('loaded')*500;
        put('loaded',`${number('loaded')} / 100`);put('full','50,000 Token');put('lazy',`${lazy.toLocaleString()} Token`);put('saving',`${((1-lazy/50000)*100).toFixed(1)}%`);break;
      }
      case 'rollout': {
        const n=number('traffic');put('new',`${n}%`);put('old',`${100-n}%`);demo.querySelector('.traffic-bar span').style.width=`${n}%`;
        put('strategy',n===0?'新模型未接入流量；先完成离线评测。':n<=5?'小流量验证，重点观察错误、成本和严重质量回归。':n<50?'扩大验证范围，持续比较质量、延迟和成本；异常时回滚。':n<100?'大范围放量，关注长尾场景和稳定性，保留回滚能力。':'全部流量进入新模型，继续监控并保留旧版本回滚能力。');break;
      }
    }
  }
  demo.addEventListener('input',update);
  demo.addEventListener('change',update);
  demo.addEventListener('click',event=>{const action=event.target.closest('[data-action]')?.dataset.action;if(action==='next')step=Math.min(step+1,stages.length-1);if(action==='reset')step=0;if(action)update();});
  update();
});
