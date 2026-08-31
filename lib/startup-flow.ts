export type StartupScenario = "normal" | "restoring" | "offline" | "maintenance" | "required_update" | "optional_update" | "outage";

export function startupDestination(scenario: StartupScenario, hasCustomer: boolean) {
  if (scenario !== "normal") return "/startup";
  return hasCustomer ? "/(tabs)" : "/auth/welcome";
}

export function startupScenarioLabel(scenario: StartupScenario) {
  return {
    normal: "Normal entry",
    restoring: "Restoring session",
    offline: "Offline safe entry",
    maintenance: "Scheduled maintenance",
    required_update: "Required update",
    optional_update: "Optional update",
    outage: "Service outage",
  }[scenario];
}
