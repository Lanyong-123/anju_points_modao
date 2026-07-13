(function () {
  const config = window.TASK_AUDIT_CONFIG;
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action") || config.defaultAction;
  const readOnly = params.get("mode") === "view";
  const data = config.actions[action] || config.actions[config.defaultAction];
  const pageTitle = readOnly ? `${data.type}详情` : `${data.type}处理`;

  document.title = pageTitle;
  document.getElementById("pageTitle").textContent = pageTitle;
  document.getElementById("detailTitle").textContent = `${data.type}申请详情`;
  document.getElementById("detailList").innerHTML = data.fields.map(item => `<span>${item[0]}</span><strong>${item[1]}</strong>`).join("");
  document.getElementById("changeNote").innerHTML = `<strong>申请说明：</strong>${data.note}`;

  function openList() {
    const target = readOnly
      ? { title: "已处理", url: "files/task-processed.html", local: "task-processed.html" }
      : { title: "待审核", url: "files/task-pending.html", local: "task-pending.html" };
    try {
      if (window.parent !== window && window.parent.openTab) {
        window.parent.openTab({ title: target.title, url: target.url });
        return;
      }
    } catch (error) {
      // Direct file previews can restrict access to the parent frame.
    }
    window.location.href = target.local;
  }

  document.getElementById("backBtn").textContent = readOnly ? "返回已处理" : "返回待审核";
  document.getElementById("backBtn").addEventListener("click", openList);
  document.getElementById("cancelBtn").addEventListener("click", openList);
  document.getElementById("doneBtn").addEventListener("click", openList);

  if (readOnly) {
    const resultParam = params.get("result") || "pass";
    const pending = resultParam === "pending";
    const approved = resultParam !== "reject" && !pending;
    const result = pending ? "待提交" : approved ? "审核通过" : "审核不通过";
    document.querySelector(".task-process-layout").style.gridTemplateColumns = "1fr";
    const auditHeading = [...document.querySelectorAll(".panel-hd h3")].find(item => item.textContent === "审核操作");
    if (auditHeading) auditHeading.closest(".panel").style.display = "none";
    const badge = document.getElementById("statusBadge");
    badge.className = `badge ${pending ? "gold" : approved ? "green" : "red"}`;
    badge.textContent = result;
    document.getElementById("recordRows").innerHTML = pending
      ? '<tr><td>-</td><td><span class="badge gold">待提交</span></td><td>-</td><td>申请尚未提交审核</td></tr>'
      : `<tr><td>2026-05-26 10:16</td><td><span class="badge ${approved ? "green" : "red"}">${result}</span></td><td>审核主管</td><td>${approved ? `${data.type}内容符合要求，审核通过` : `${data.type}申请依据不足，审核不通过`}</td></tr>`;
  }

  document.querySelectorAll('input[name="result"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const pass = radio.value === "pass";
      document.getElementById("auditNotice").innerHTML = pass
        ? `<strong>审核通过</strong>通过后${data.passMessage}`
        : `<strong>审核不通过</strong>不通过后申请退回，业务数据不发生变动。`;
      document.getElementById("auditOpinion").value = pass ? `${data.type}内容符合要求，审核通过` : `${data.type}申请依据不足，审核不通过`;
    });
  });

  document.getElementById("auditNotice").innerHTML = `<strong>审核通过</strong>通过后${data.passMessage}`;
  document.getElementById("auditOpinion").value = `${data.type}内容符合要求，审核通过`;
  document.getElementById("submitBtn").addEventListener("click", () => {
    const opinion = document.getElementById("auditOpinion").value.trim();
    if (!opinion) {
      document.getElementById("auditOpinion").focus();
      return;
    }
    const pass = document.querySelector('input[name="result"]:checked').value === "pass";
    const result = pass ? "审核通过" : "审核不通过";
    const badge = document.getElementById("statusBadge");
    badge.className = `badge ${pass ? "green" : "red"}`;
    badge.textContent = result;
    document.getElementById("recordRows").innerHTML = `<tr><td>2026-05-26 10:16</td><td><span class="badge ${pass ? "green" : "red"}">${result}</span></td><td>审核主管</td><td>${opinion}</td></tr>`;
    document.getElementById("successResult").textContent = result;
    document.getElementById("successModal").classList.add("open");
  });

  document.querySelectorAll("[data-close-modal]").forEach(button => {
    button.addEventListener("click", () => button.closest(".modal-mask").classList.remove("open"));
  });
}());
