(function () {
  const projectTreeData = [
    {
      name: "广东省",
      children: [
        {
          name: "深圳市",
          children: [
            { name: "南山区", children: ["高新安荟邻", "高新花园"] },
            { name: "福田区", children: ["景田安荟邻"] },
            { name: "坪山区", children: ["秀馨苑"] },
            { name: "宝安区", children: ["宝安人才园"] }
          ]
        },
        {
          name: "广州市",
          children: [
            { name: "天河区", children: ["天河安居项目"] },
            { name: "海珠区", children: ["海珠安居项目"] }
          ]
        }
      ]
    }
  ];
  const defaultExpanded = [
    "广东省",
    "广东省/深圳市",
    "广东省/深圳市/南山区",
    "广东省/深圳市/福田区",
    "广东省/深圳市/坪山区",
    "广东省/深圳市/宝安区",
    "广东省/广州市",
    "广东省/广州市/天河区",
    "广东省/广州市/海珠区"
  ];

  function initProjectTree(select) {
    const trigger = select.querySelector("[data-project-tree-trigger]");
    const value = select.querySelector("[data-project-tree-value]");
    const panel = select.querySelector("[data-project-tree-panel]");
    const expanded = new Set(defaultExpanded);

    function render() {
      const renderNodes = (nodes, parents = [], depth = 1) => nodes.map(node => {
        const item = typeof node === "string" ? { name: node } : node;
        const key = [...parents, item.name].join("/");
        const path = [...parents, item.name].join(" / ");
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;
        const isOpen = expanded.has(key);
        const row = `<div class="project-tree-row project-tree-level-${Math.min(depth, 4)}${hasChildren ? "" : " project-tree-leaf"}" ${hasChildren ? `data-project-toggle="${key}"` : `data-project-path="${path}"`}><span class="project-tree-toggle">${hasChildren ? (isOpen ? "▾" : "▸") : "·"}</span><span>${item.name}</span></div>`;
        return row + (hasChildren && isOpen ? renderNodes(item.children, [...parents, item.name], depth + 1) : "");
      }).join("");
      panel.innerHTML = `<div class="project-tree-title">安居项目架构</div><div class="project-tree-row project-tree-leaf" data-project-path="全部项目"><span class="project-tree-toggle">·</span><span>全部项目</span></div>${renderNodes(projectTreeData)}`;
    }

    trigger.addEventListener("click", event => {
      event.stopPropagation();
      document.querySelectorAll(".project-tree-select.open").forEach(tree => {
        if (tree !== select) tree.classList.remove("open");
      });
      select.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(select.classList.contains("open")));
    });
    panel.addEventListener("click", event => {
      const row = event.target.closest(".project-tree-row");
      if (!row) return;
      const toggle = row.dataset.projectToggle;
      if (toggle) {
        if (expanded.has(toggle)) expanded.delete(toggle);
        else expanded.add(toggle);
        render();
        return;
      }
      const path = row.dataset.projectPath;
      if (path) {
        value.value = path;
        trigger.textContent = path;
        select.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
    render();
  }

  const projectTrees = [...document.querySelectorAll("[data-project-tree]")];
  projectTrees.forEach(initProjectTree);
  document.addEventListener("click", event => {
    projectTrees.forEach(tree => {
      if (!tree.contains(event.target)) {
        tree.classList.remove("open");
        tree.querySelector("[data-project-tree-trigger]").setAttribute("aria-expanded", "false");
      }
    });
  });
})();
