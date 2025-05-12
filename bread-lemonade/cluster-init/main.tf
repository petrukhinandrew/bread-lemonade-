resource "kind_cluster" "this" {
  name            = var.cluster_name
  node_image      = "kindest/node:${var.cluster_version}"
  kubeconfig_path = pathexpand(var.kubeconfig_file)
  wait_for_ready  = true

  kind_config {
    kind        = "Cluster"
    api_version = "kind.x-k8s.io/v1alpha4"

    node {
      role = "control_plane"
      extra_port_mappings {
        container_port = 80
        host_port      = var.host_port
      }

      kubeadm_config_patches = [
        "kind: InitConfiguration\nnodeRegistration:\n  kubeletExtraArgs:\n    node-labels: \"ingress-ready=true\"\n"
      ]
    }

    node {
      role   = "worker"
      labels = { tier = "backend" }
    }

    node {
      role   = "worker"
      labels = { tier = "frontend" }
    }


    # dynamic "node" {
    #   for_each = range(3)
    #   content {
    #     role   = "worker"
    #     labels = { app = "mongodb", tier = "db" }
    #   }
    # }
  }
}

resource "null_resource" "w1_image" {
  provisioner "local-exec" {
    command     = "kind load docker-image backend:latest -n kek"
    interpreter = ["bash", "-c"]
  }
  depends_on = [kind_cluster.this]
}

resource "null_resource" "w2_image" {
  provisioner "local-exec" {
    command     = "kind load docker-image frontend:latest -n kek"
    interpreter = ["bash", "-c"]
  }
  depends_on = [kind_cluster.this]
}

# data "local_file" "nginx_manifest_raw" {
#   filename = "${path.module}/deploy-ingress-nginx.yaml"
# }

# resource "kubectl_manifest" "nginx_manifest" {
#   manifest = yamldecode(data.local_file.nginx_manifest)
# }